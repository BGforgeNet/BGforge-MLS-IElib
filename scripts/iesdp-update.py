#!/usr/bin/env python3
# coding: utf-8

import sys, os
import frontmatter
import argparse
import re
from collections import OrderedDict

#parse args
parser = argparse.ArgumentParser(description='Get updates from IESDP', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument('-s', dest='iesdp_dir', help='iesdp directory', required=True)
parser.add_argument('--opcode_file', dest='opcode_file', help='opcode definition file (weidu tpp)', required=True)
args=parser.parse_args()

#init vars
opcode_file = args.opcode_file
iesdp_dir = args.iesdp_dir
opcode_dir = os.path.join(iesdp_dir, '_opcodes')
opcodes = []
opcodes_ee = []
ee_min_opcode = 318 # everything below this doesn't make it to opcode_ee.tpp
tpp_text = ""
skip_opcode_names = ['empty', 'crash', 'unknown']

def find_file(path, name):
  for root, dirs, files in os.walk(path):
    if name in files:
      return os.path.join(root, name)

def find_files(path, ext):
  flist = []
  for root, dirs, files in os.walk(path):
    for f in files:
      if f.lower().endswith(ext.lower()):
        flist.append(os.path.join(root, f))
  return flist

def opcode_name(name):
  # these are replace anywhere in the string
  replacements = {
    ' ': '_',
    ')': '_',
    '(': '_',
    ':': '',
    '-': '_',
    ',': '',
    '&': '',
    '.': '',
    "'": '',
    '/': '_',
    'modifier': 'mod',
    'resistance': 'resist',
    'removal_remove': 'remove',
    'high_level_ability': 'HLA',
    '____': '_',
    '___': '_',
    '__': '_',
    '__': '_' # intentional
  }
  # these are stripped from left part
  lstrip = [
    'item_',
    'graphics_',
    'spell_effect_', # should be before _spell
    'spell_',
    'stat_',
    'state_',
    'summon_',
  ]
  name = name.lower()
  for r in replacements:
    name = name.replace(r, replacements[r])
  name = name.rstrip('_').lstrip('_')
  for l in lstrip:
    if name.startswith(l):
      name = name[len(l):]
  return name

files = find_files(opcode_dir, 'html')
for f in files:
  opcode = frontmatter.load(f)
  if opcode['bg2'] == 1: # just bg2 opcodes for now
    opcodes.append(opcode)

opcodes = sorted(opcodes, key=lambda k: k["n"])
opcodes_unique = {}
for o in opcodes:
  name = opcode_name(o['name'])
  if name in skip_opcode_names:
    continue
  name_count = len([i for i in opcodes_unique if i == name]) # some name collude, need to make unique
  if name_count > 0:
    name = name + '_{}'.format(name_count + 1)
  opcodes_unique[name] = o['n']

for o in opcodes_unique:
  tpp_text += ("OPCODE_{} = {}\n".format(o, opcodes_unique[o]))

with open(opcode_file, 'w') as f:
  print(tpp_text, file=f)
